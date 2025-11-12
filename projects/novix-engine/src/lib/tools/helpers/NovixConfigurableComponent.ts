export abstract class NovixConfigurationComponent<TConfig extends object> {
  /**
   * Merge configuration layers with precedence:
   * 1) Injected/global config    (lowest)
   * 2) Reusable/manual [config]  (middle)
   * 3) Direct component inputs   (highest)
   *
   * Default values are always backfilled so basic usage works.
   * Null/undefined values never overwrite a value from a lower layer.
   * Direct inputs only override if they differ from the component defaults,
   * so default echoes don't stomp on reusable configs.
   */
  protected mergeConfigs(
    // Lowest precedence: DI-provided config
    injectedConfig: Partial<TConfig> | null | undefined,
    // Middle precedence: reusable config via [config]
    reusableConfig: Partial<TConfig> | null | undefined,
    // Highest precedence: direct inputs (signals read by caller)
    directInputs: Partial<TConfig> | null | undefined,
    // Component’s intrinsic defaults (a complete set of properties)
    defaultValues: TConfig
  ): TConfig {
    // Helper: copy only properties with non-null, non-undefined values
    const keepOnlyDefined = (config: Partial<TConfig> | null | undefined): Partial<TConfig> => {
      if (!config) return {};
      const result: Partial<TConfig> = {};
      for (const [propertyName, propertyValue] of Object.entries(config)) {
        if (propertyValue !== null && propertyValue !== undefined) {
          (result as any)[propertyName] = propertyValue;
        }
      }
      return result;
    };

    // Helper: from a set of direct inputs, keep only values that
    // a) are defined, and
    // b) differ from defaults (so we treat them as “intentional overrides”).
    // This prevents default echoes (e.g., 'horizontal', true) from overriding configs.
    const keepIntentionalOverrides = (
      inputs: Partial<TConfig> | null | undefined,
      defaults: TConfig
    ): Partial<TConfig> => {
      if (!inputs) return {};
      const result: Partial<TConfig> = {};
      for (const [propertyName, propertyValue] of Object.entries(inputs)) {
        const defaultValue = (defaults as any)[propertyName];
        const isDefined = propertyValue !== null && propertyValue !== undefined;
        const differsFromDefault = isDefined && propertyValue !== defaultValue;
        if (differsFromDefault) {
          (result as any)[propertyName] = propertyValue;
        }
      }
      return result;
    };

    // Layer 0: start from defaults so basic usage always has full values
    const merged: TConfig = { ...defaultValues };

    // Layer 1: apply DI config (defined values only)
    Object.assign(merged, keepOnlyDefined(injectedConfig));

    // Layer 2: apply reusable/manual [config] (defined values only)
    Object.assign(merged, keepOnlyDefined(reusableConfig));

    // Layer 3: apply direct inputs, but only if they look intentional (differ from defaults)
    Object.assign(merged, keepIntentionalOverrides(directInputs, defaultValues));

    // The result is a complete TConfig object:
    // - Defaults ensure baseline values are present.
    // - Each higher layer overwrites lower layers for defined properties.
    // - Direct inputs don’t stomp configs unless they differ from defaults.
    return merged;
  }
}
