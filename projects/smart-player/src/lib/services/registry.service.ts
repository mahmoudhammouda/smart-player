import { Injectable, InjectionToken, Type } from '@angular/core';
import { CustomNodeDefinition } from '../models/slide.model';

export const SP_CUSTOM_NODES = new InjectionToken<CustomNodeDefinition[]>('SP_CUSTOM_NODES');

@Injectable({ providedIn: 'root' })
export class RegistryService {
  private registry = new Map<string, Type<unknown>>();
  private labels = new Map<string, string>();

  register(type: string, component: Type<unknown>, label?: string): void {
    this.registry.set(type, component);
    if (label) {
      this.labels.set(type, label);
    }
  }

  get(type: string): Type<unknown> | undefined {
    return this.registry.get(type);
  }

  has(type: string): boolean {
    return this.registry.has(type);
  }

  getLabel(type: string): string | undefined {
    return this.labels.get(type);
  }

  getAll(): Map<string, Type<unknown>> {
    return new Map(this.registry);
  }
}
