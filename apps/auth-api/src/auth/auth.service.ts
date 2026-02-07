import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CasdoorService } from '../casdoor/casdoor.service';
import { VerifyService } from '../verify/verify.service';
import { RegisterDto, LoginDto } from './dto';
import { generateTrueUUID } from './utils/trueuuid';

/**
 * 认证服务
 */
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService,
        private casdoorService: CasdoorService,
        private verifyService: VerifyService,
    ) { }

    /**
     * 用户注册 (严格模式: 需验证码)
     */
    async register(dto: RegisterDto): Promise<{ accessToken: string; user: any }> {
        const { username, password, email, phone, verifyCode, verifyType } = dto;

        // 验证验证码
        const target = verifyType === 'email' ? email : phone;
        if (!target) {
            throw new BadRequestException(`缺少 ${verifyType === 'email' ? '邮箱' : '手机号'}`);
        }

        const isValid = await this.verifyService.verifyCode(target, verifyCode);
        if (!isValid) {
            throw new BadRequestException('验证码错误或已过期');
        }

        // 生成 TrueUUID (与 Minecraft 离线模式一致)
        const uuid = generateTrueUUID(username);

        // 调用 Casdoor 注册
        const result = await this.casdoorService.register(username, password, email, phone);

        if (result.status !== 'ok') {
            this.logger.error(`注册失败: ${result.msg}`);
            throw new BadRequestException('注册失败: ' + (result.msg || '未知错误'));
        }

        // 生成 JWT Token
        const payload = { sub: uuid, username, email, phone };
        const accessToken = this.jwtService.sign(payload);

        this.logger.log(`用户注册成功: ${username} (UUID: ${uuid})`);

        return {
            accessToken,
            user: {
                uuid,
                username,
                email,
                phone,
            },
        };
    }

    /**
     * 用户登录
     */
    async login(dto: LoginDto): Promise<{ accessToken: string; user: any }> {
        const { username, password } = dto;

        // 调用 Casdoor 验证
        const result = await this.casdoorService.login(username, password);
        this.logger.debug(`Casdoor 登录结果: ${JSON.stringify(result)}`);

        if (result.status !== 'ok') {
            throw new UnauthorizedException('用户名或密码错误: ' + (result.msg || '未知错误'));
        }

        // 生成 TrueUUID
        const uuid = generateTrueUUID(username);

        // 生成 JWT Token
        const payload = { sub: uuid, username };
        const accessToken = this.jwtService.sign(payload);

        this.logger.log(`用户登录成功: ${username}`);

        return {
            accessToken,
            user: {
                uuid,
                username,
            },
        };
    }

    /**
     * 验证 Token 并返回用户信息
     */
    async validateToken(token: string): Promise<any> {
        this.logger.debug(`验证 Token: ${token}`);
        if (!token) {
            this.logger.error('Token 为空');
            throw new UnauthorizedException('Token 为空');
        }
        try {
            const payload = this.jwtService.verify(token);
            this.logger.debug(`Token 验证通过: ${JSON.stringify(payload)}`);
            return payload;
        } catch (error) {
            this.logger.error('Token 验证失败', error);
            throw new UnauthorizedException('无效的 Token');
        }
    }
}
