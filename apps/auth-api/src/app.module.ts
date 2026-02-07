import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CasdoorModule } from './casdoor/casdoor.module';
import { VerifyModule } from './verify/verify.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // 限流配置
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 60000,    // 1 分钟
          limit: 10,      // 最多 10 次请求
        },
        {
          name: 'long',
          ttl: 3600000,  // 1 小时
          limit: 100,     // 最多 100 次请求  
        },
      ],
    }),
    // 功能模块
    AuthModule,
    CasdoorModule,
    VerifyModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
