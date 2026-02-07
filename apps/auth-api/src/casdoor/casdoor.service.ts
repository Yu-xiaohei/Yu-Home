import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Casdoor 服务 (Headless 模式)
 * 
 * 通过 Casdoor REST API 实现用户认证和管理
 * @see https://casdoor.org/docs/basic/server-installation
 */
@Injectable()
export class CasdoorService {
    private readonly logger = new Logger(CasdoorService.name);
    private readonly client: AxiosInstance;
    private readonly orgName: string;
    private readonly appName: string;

    constructor(private configService: ConfigService) {
        const endpoint = this.configService.get<string>('CASDOOR_ENDPOINT');
        const clientId = this.configService.get<string>('CASDOOR_CLIENT_ID');
        const clientSecret = this.configService.get<string>('CASDOOR_CLIENT_SECRET');

        this.orgName = this.configService.get<string>('CASDOOR_ORG_NAME', 'built-in');
        this.appName = this.configService.get<string>('CASDOOR_APP_NAME', 'app-built-in');

        this.client = axios.create({
            baseURL: endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                clientId,
                clientSecret,
            },
        });

        this.logger.log(`Casdoor 服务初始化完成: ${endpoint}`);
    }

    /**
     * 用户注册
     */
    async register(username: string, password: string, email?: string, phone?: string): Promise<any> {
        try {
            // 使用 add-user 接口，避免 Casdoor 进行二次验证 (因为我们已经在 VerifyService 中验证过了)
            const response = await this.client.post('/api/add-user', {
                owner: this.orgName,
                name: username,
                createdTime: new Date().toISOString(),
                displayName: username,
                password,
                email,
                phone,
                signupApplication: this.appName,
                type: 'normal-user',
            });
            this.logger.debug(`Casdoor 注册(add-user)响应: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error('注册失败', error);
            if (error.response) {
                this.logger.error('Casdoor 响应:', JSON.stringify(error.response.data));
            }
            throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 用户登录
     */
    async login(username: string, password: string): Promise<any> {
        try {
            const response = await this.client.post('/api/login', {
                application: this.appName,
                organization: this.orgName,
                username,
                password,
                type: 'token',
            });
            return response.data;
        } catch (error) {
            this.logger.error('登录失败', error);
            if (error.response) {
                this.logger.error('Casdoor 响应:', JSON.stringify(error.response.data));
            }
            throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * 获取用户信息
     */
    async getUser(userId: string): Promise<any> {
        try {
            const response = await this.client.get(`/api/get-user`, {
                params: { id: `${this.orgName}/${userId}` },
            });
            return response.data;
        } catch (error) {
            this.logger.error('获取用户信息失败', error);
            throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
        }
    }

    /**
     * 更新用户信息
     */
    async updateUser(userId: string, data: Partial<{
        displayName: string;
        avatar: string;
        email: string;
        phone: string;
    }>): Promise<any> {
        try {
            const response = await this.client.post('/api/update-user', {
                owner: this.orgName,
                name: userId,
                ...data,
            });
            return response.data;
        } catch (error) {
            this.logger.error('更新用户信息失败', error);
            throw new HttpException('更新失败', HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 验证 Token
     */
    async verifyToken(token: string): Promise<any> {
        try {
            const response = await this.client.post('/api/login/oauth/introspect', {
                token,
                token_type_hint: 'access_token',
            });
            return response.data;
        } catch (error) {
            this.logger.error('Token 验证失败', error);
            throw new HttpException('无效的 Token', HttpStatus.UNAUTHORIZED);
        }
    }
}
