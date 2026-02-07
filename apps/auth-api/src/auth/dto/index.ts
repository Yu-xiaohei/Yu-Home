import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsEnum, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

/** 验证类型 */
export type VerifyType = 'email' | 'sms';

/**
 * 注册 DTO
 */
export class RegisterDto {
    @IsString()
    @MinLength(3, { message: '用户名至少 3 个字符' })
    @MaxLength(16, { message: '用户名最多 16 个字符' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
    username: string;

    @IsString()
    @MinLength(6, { message: '密码至少 6 个字符' })
    password: string;

    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @IsOptional()
    @IsString()
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
    phone?: string;

    @IsString()
    @MinLength(4, { message: '验证码不正确' })
    @MaxLength(6, { message: '验证码不正确' })
    verifyCode: string;

    @IsEnum(['email', 'sms'])
    verifyType: VerifyType;
}

export class VerifyTokenDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}

/**
 * 登录 DTO
 */
export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

/**
 * 发送验证码 DTO
 */
export class SendCodeDto {
    @IsString()
    target: string; // 邮箱或手机号

    @IsEnum(['email', 'sms'])
    type: VerifyType;
}
