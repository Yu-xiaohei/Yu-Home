import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VerifyService } from './verify.service';

@Module({
    imports: [ConfigModule],
    providers: [VerifyService],
    exports: [VerifyService],
})
export class VerifyModule { }
