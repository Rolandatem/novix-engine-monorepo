import { NovixConfigurationComponent } from "./NovixConfigurableComponent"

//--Dummy configuration to test with.
interface ITestingConfig {
  unionProperty: 'first' | 'second' | 'third',
  booleanProperty: boolean,
  numberProperty?: number | null,
  stringProperty?: string | null
};

//--Test class deriving from the dummy configuration.
class TestConfigurable extends NovixConfigurationComponent<ITestingConfig> {
  public merge(
    injected: Partial<ITestingConfig> | null,
    reusableConfig: Partial<ITestingConfig> | null,
    direct: Partial<ITestingConfig> | null,
    defaults: ITestingConfig
  ): ITestingConfig {
    return this.mergeConfigs(injected, reusableConfig, direct, defaults);
  }
}

describe('NovixConfigurationComponent.mergeConfigs', () => {
  const defaults: ITestingConfig = {
    unionProperty: 'second',
    booleanProperty: true,
    numberProperty: null,
    stringProperty: null
  };
  let helper: TestConfigurable;

  beforeEach(async() => {
    helper = new TestConfigurable();
  })

  //===========================================================================================================================
  it('should create', () => {
    expect(helper).toBeTruthy();
  })

  //===========================================================================================================================
  it('should return defaults when nothing is provided', () => {
    const result = helper.merge(null, null, null, defaults);
    expect(result).toEqual(defaults);
  })

  //===========================================================================================================================
  it('should apply injeected config over defaults', () => {
    const result = helper.merge({ unionProperty: 'first' }, null, null, defaults);

    //--Updated
    expect(result.unionProperty).toBe('first');

    //--Defaults
    expect(result.booleanProperty).toBe(true);
    expect(result.stringProperty).toBeNull();
  })

  //===========================================================================================================================
  it('should apply reusable config over injected', () => {
    const result = helper.merge(
      { unionProperty: 'first' },
      { unionProperty: 'third', numberProperty: 14, stringProperty: 'test' },
      null,
      defaults
    );

    expect(result.unionProperty).toBe('third');
    expect(result.booleanProperty).toBe(true);
    expect(result.numberProperty).toBe(14);
    expect(result.stringProperty).toBe('test');
  })

  //===========================================================================================================================
  it('should apply direct inputs over reusable, if different from defaults', () => {
    const result = helper.merge(
      null,
      { unionProperty: 'first' },
      { unionProperty: 'second', stringProperty: 'test' },
      defaults
    );

    //--unionProperty is the same as the default, so it should not override reusable.
    expect(result.unionProperty).toBe('first');
    //--stringProperty differs from default, so it overrides.
    expect(result.stringProperty).toBe('test');
  })

  //===========================================================================================================================
  it ('should ignore null/undefined values', () => {
    const result = helper.merge(
      { unionProperty: 'first' },
      { stringProperty: null },
      { numberProperty: undefined },
      defaults
    );

    expect(result.unionProperty).toBe('first');
    expect(result.stringProperty).toBeNull();
    expect(result.numberProperty).toBeNull();
  })

})
