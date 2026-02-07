import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * 验证码服务
 * 
 * 支持邮箱验证码和阿里云短信验证码
 */
@Injectable()
export class VerifyService {
    private readonly logger = new Logger(VerifyService.name);
    private readonly redis: Redis;
    private readonly codeExpireSeconds = 300; // 5 分钟有效期

    constructor(private configService: ConfigService) {
        const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
        const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

        this.redis = new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword || undefined,
        });

        this.logger.log(`Redis 连接初始化: ${redisHost}:${redisPort}`);
    }

    /**
     * 生成 6 位随机验证码
     */
    private generateCode(): string {
        return Math.random().toString().slice(2, 8);
    }

    /**
     * 发送验证码
     */
    async sendCode(target: string, type: 'email' | 'sms'): Promise<void> {
        // 检查发送频率 (1 分钟内只能发送 1 次)
        const rateLimitKey = `verify:ratelimit:${target}`;
        const exists = await this.redis.exists(rateLimitKey);
        if (exists) {
            throw new BadRequestException('发送过于频繁，请稍后再试');
        }

        // 生成验证码
        const code = this.generateCode();
        const codeKey = `verify:code:${target}`;

        // 存储验证码到 Redis
        await this.redis.setex(codeKey, this.codeExpireSeconds, code);
        await this.redis.setex(rateLimitKey, 60, '1'); // 60 秒限流

        // 根据类型发送验证码
        if (type === 'email') {
            await this.sendEmailCode(target, code);
        } else {
            await this.sendSmsCode(target, code);
        }

        const maskedTarget = target ? `${target.slice(0, 3)}***` : 'unknown';
        this.logger.log(`验证码已发送: ${type} -> ${maskedTarget}`);
    }

    /**
     * 验证验证码
     */
    async verifyCode(target: string, code: string): Promise<boolean> {
        const codeKey = `verify:code:${target}`;
        const storedCode = await this.redis.get(codeKey);

        if (!storedCode || storedCode !== code) {
            return false;
        }

        // 验证成功后删除验证码
        await this.redis.del(codeKey);
        return true;
    }

    /**
     * 发送邮箱验证码
     */
    private async sendEmailCode(email: string, code: string): Promise<void> {
        // TODO: 集成邮件发送服务 (nodemailer)
        this.logger.log(`[邮箱] 验证码 ${code} -> ${email}`);

        // 开发环境直接打印验证码
        if (this.configService.get<string>('NODE_ENV') === 'development') {
            this.logger.warn(`[DEV] 邮箱验证码: ${code}`);
        }
    }

    /**
     * 发送短信验证码 (阿里云)
     */
    private async sendSmsCode(phone: string, code: string): Promise<void> {
        const accessKeyId = this.configService.get<string>('ALIYUN_ACCESS_KEY_ID');
        const accessKeySecret = this.configService.get<string>('ALIYUN_ACCESS_KEY_SECRET');
        const signName = this.configService.get<string>('ALIYUN_SMS_SIGN_NAME');
        const templateCode = this.configService.get<string>('ALIYUN_SMS_TEMPLATE_CODE');

        // TODO: 集成阿里云 SDK 发送短信
        // @aliyun/sdk-mcp 集成
        this.logger.log(`[短信] 验证码 ${code} -> ${phone}`);

        // 开发环境直接打印验证码
        if (this.configService.get<string>('NODE_ENV') === 'development') {
            this.logger.warn(`[DEV] 短信验证码: ${code}`);
        }
    }
}
