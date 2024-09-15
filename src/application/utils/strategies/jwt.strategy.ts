import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/domain/entities/user.entity";
import UserRepository from "src/infrastructure/database/repositories/user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload:User){
        const user = await this.userRepository.findOne(payload.id)
        return user;
    }
}