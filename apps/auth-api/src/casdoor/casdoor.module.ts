import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CasdoorService } from './casdoor.service';

@Module({
    imports: [ConfigModule],
    providers: [CasdoorService],
    exports: [CasdoorService],
})
export class CasdoorModule { }
