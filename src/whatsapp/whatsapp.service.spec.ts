// whatsapp/whatsapp.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { WhatsappService } from "./whatsapp.service";
import { ConfigService, ConfigModule } from "@nestjs/config";

describe("WhatsappService", () => {
  let service: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule], // Import ConfigModule
      providers: [WhatsappService],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
