import { Injectable, Type } from '@angular/core';
import { NodeType } from '../models/slide.model';

@Injectable({ providedIn: 'root' })
export class RegistryService {
  private registry = new Map<NodeType, Type<unknown>>();

  register(type: NodeType, component: Type<unknown>): void {
    this.registry.set(type, component);
  }

  get(type: NodeType): Type<unknown> | undefined {
    return this.registry.get(type);
  }

  has(type: NodeType): boolean {
    return this.registry.has(type);
  }

  getAll(): Map<NodeType, Type<unknown>> {
    return new Map(this.registry);
  }
}
