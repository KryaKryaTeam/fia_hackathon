import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ILoadFileService } from '@/files/application/bounds/ILoadFileService';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { Readable } from 'stream';
import { BaseLoadController } from '../loadControllers/BaseLoadController';
import { DiscoveryService } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { ApiError, ServiceErrors } from '@/error/ApiError';

export const LoadController = DiscoveryService.createDecorator();

export class LoadFileService implements ILoadFileService, OnModuleInit {
  private loadControllers: Map<string, BaseLoadController> = new Map();
  private readonly logger = new Logger(LoadFileService.name);

  @Inject()
  private readonly discoveryService: DiscoveryService;

  @Inject()
  private readonly configService: ConfigService;

  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((el) => {
      if (!this.discoveryService.getMetadataByDecorator(LoadController, el))
        return;

      this.addLoadController(
        this.discoveryService.getMetadataByDecorator(
          LoadController,
          el,
        ) as string,
        el.instance as BaseLoadController,
      );
    });
  }

  async loadFile(file: Readable, rel: RelationString): Promise<FileEntity> {
    this.logger.log(`File is being uploaded for relation: ${rel.value}`);
    return await this.controller.load(file, rel);
  }
  async deleteFile(file: FileEntity): Promise<void> {
    return await this.controller.delete(file);
  }

  getLink(file: FileEntity | InternalFile): Promise<string> | string {
    return this.controller.getLink(file);
  }
  private get controller() {
    const controller = this.loadControllers.get(
      this.configService.getOrThrow('storage.controller'),
    );

    if (!controller) ApiError.throw(ServiceErrors.MISCONFIGURED);

    return controller;
  }
  private addLoadController(key: string, loadController: BaseLoadController) {
    this.logger.log(`Load Controller added: ${key}`);
    this.loadControllers.set(key, loadController);
  }
}
