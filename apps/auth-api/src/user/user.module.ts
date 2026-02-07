import { Module } from '@nestjs/common';
import { CasdoorModule } from '../casdoor/casdoor.module';

@Module({
    imports: [CasdoorModule],
    controllers: [],
    providers: [],
})
export class UserModule { }
