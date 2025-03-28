// whatsapp/whatsapp.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { WhatsappController } from "./whatsapp.controller";
import { WhatsappService } from "./whatsapp.service";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";

describe("WhatsappController", () => {
  let controller: WhatsappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule], // Import ConfigModule
      controllers: [WhatsappController],
      providers: [WhatsappService],
    }).compile();

    controller = module.get<WhatsappController>(WhatsappController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
