import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, SendCodeDto, VerifyTokenDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { VerifyService } from '../verify/verify.service';

/**
 * 认证控制器
 */
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
    constructor(
        private authService: AuthService,
        private verifyService: VerifyService,
    ) { }

    /**
     * 发送验证码
     */
    @Post('send-code')
    @HttpCode(HttpStatus.OK)
    async sendCode(@Body() dto: SendCodeDto) {
        await this.verifyService.sendCode(dto.target, dto.type);
        return { message: '验证码已发送' };
    }

    /**
     * 用户注册
     */
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    /**
     * 用户登录
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    /**
     * 获取当前用户信息
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req: { user: { uuid: string; username: string } }) {
        return { user: req.user };
    }

    /**
     * Token 验证 (MC 服务器调用)
     */
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verifyToken(@Body() dto: VerifyTokenDto) {
        const user = await this.authService.validateToken(dto.accessToken);
        return { valid: true, user };
    }
}
