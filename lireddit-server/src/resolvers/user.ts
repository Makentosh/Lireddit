import {Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root} from 'type-graphql';
import {MyContext} from '../types';
import {User} from '../entities/User';
import argon2 from 'argon2';
import {COOKIE_NAME, FORGET_PASSWORD_PREFIX} from '../constants';
import {validateRegister} from '../utils/validateRegister';
import {UsernamePasswordInput} from './UsernamePasswordInput';
import {sendEmail} from '../utils/sendEmail';
import {v4} from 'uuid';
import {getConnection} from 'typeorm';


@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(
        @Root() user: User, 
        @Ctx() {req}: MyContext
    ) {
        //this is the current user and its ok to show their own email
        if(req.session.userId === user.id) {
            return user.email
        }

        return "" ;
    }


    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req}: MyContext
    ): Promise<UserResponse> {

        if (newPassword.length <= 3) {
            return {errors: [{field: 'newPassword', message: 'password length must greater than 3'}]}
        }

        const key = FORGET_PASSWORD_PREFIX + token
        const userId = await redis.get(key)

        if (!userId) {
            return {errors: [{field: 'token', message: 'token is invalid or expired'}]}
        }

        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum)

        if (!user) {
            return {errors: [{field: 'token', message: 'user no longer exists'}]}
        }


        await User.update({id: userIdNum}, {
            password: await argon2.hash(newPassword)
        })

        await redis.del(key)
        // log in user after change password
        req.session.userId = user.id;

        return {user};
    }


    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis}: MyContext
    ) {
        const user = await User.findOne({where: {email}})

        if (!user) {
            //the email in not in the db
            return true
        }

        const token = v4();
        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24 / 3
        )

        const text = `<a href="http://localhost:3000/change-password/${token}">reset password</a>`;
        await sendEmail(email, text);

        return true
    }


    @Query(() => User, {nullable: true})

    async me(
        @Ctx() {req}: MyContext
    ) {
        //not logged
        if (!req.session.userId) {
            return null
        }

        return User.findOne(req.session.userId)
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {

        const errors = validateRegister(options);

        if (errors) {
            return {errors};
        }

        const hashedPassword = await argon2.hash(options.password)

        let user;

        try {
            // User.create({}).save()
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(
                    {
                        username: options.username,
                        password: hashedPassword,
                        email: options.email,
                    }
                ).returning('*')
                .execute()

            user = result.raw[0];
        } catch (error) {
            if (error.code === '23505') {
                //duplicate name
                return {
                    errors: [{field: 'username', message: 'username already taken'}]
                }
            }
        }

        req.session!.userId = user.id
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes('@')
                ? {where: {email: usernameOrEmail}}
                : {where: {username: usernameOrEmail}})
        if (!user) {
            return {
                errors: [{field: 'username', message: 'username dos\`ent exist'}]
            }
        }
        const valid = await argon2.verify(user.password, password)

        if (!valid) {
            return {
                errors: [{field: 'password', message: 'password incorrect'}]
            }
        }

        //store use id session
        //this will set a cookie on the user
        //keep logged in

        req.session!.userId = user.id

        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ) {
        return new Promise(resolve => req.session.destroy((error: any) => {
            res.clearCookie(COOKIE_NAME);
            if (error) {
                resolve(false)
                return
            }

            resolve(true)
        }))
    }
}
