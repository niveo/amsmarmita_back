import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { URL_MONGODB } from '../src/common/constantes';
import { MongooseFeatureMogule } from '../src/common/mongoose-feature.module';
import { MarmitaModule } from '../src/marmita/marmita.module';

jest.useRealTimers();

describe('MarmitaController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            return {
              uri: config.get(URL_MONGODB),
            };
          },
          inject: [ConfigService],
        }),
        MongooseFeatureMogule,
        MarmitaModule,
      ],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();

    //dataSource = app.get<DataSource>(DataSource);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GET /marmitas/listardatas', () => {
    it('deve retornar uma lista de datas', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/marmitas/listardatas')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      console.log(body);

      expect(body).toHaveLength(11);
    });
  });
});
