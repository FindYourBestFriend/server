import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@app/core/auth/auth.module';
import { OngModule } from './app/modules/ong/ong.module';
import { EmailModule } from './app/modules/email/email.module';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV === 'development',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/**/migrations/*{.js,.ts}'],
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    OngModule,
    EmailModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
