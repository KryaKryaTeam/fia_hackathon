import {
  RelationString,
  RelationSlotFamily,
  RelationSlotCode,
  RelationSlotConfig,
} from '@/files/domain/objects/RelationSlots';

describe('RelationSlot system', () => {
  //
  // -------------------------
  // RelationString
  // -------------------------
  //
  describe('RelationString', () => {
    it('should parse valid relation string', () => {
      const rel = RelationString.define('user:avatar');

      expect(rel.value).toBe('user:avatar');
      expect(rel.family).toBe('user');
      expect(rel.code).toBe('avatar');
    });

    it('should throw on invalid format (no colon)', () => {
      expect(() => RelationString.define('invalid')).toThrow();
    });

    it('should throw on empty family', () => {
      expect(() => RelationString.define(':avatar')).toThrow();
    });

    it('should throw on empty code', () => {
      expect(() => RelationString.define('user:')).toThrow();
    });
  });

  //
  // -------------------------
  // RelationSlotFamily
  // -------------------------
  //
  describe('RelationSlotFamily', () => {
    it('should extract family from relation string', () => {
      const rel = RelationString.define('user:avatar');
      const family = RelationSlotFamily.fromRelationString(rel);

      expect(family.value).toBe('user');
    });
  });

  //
  // -------------------------
  // RelationSlotCode
  // -------------------------
  //
  describe('RelationSlotCode', () => {
    it('should extract code from relation string', () => {
      const rel = RelationString.define('user:avatar');
      const code = RelationSlotCode.fromRelationString(rel);

      expect(code.value).toBe('avatar');
    });
  });

  //
  // -------------------------
  // RelationSlotConfig
  // -------------------------
  //
  describe('RelationSlotConfig', () => {
    it('should resolve config from relation string', () => {
      const rel = RelationString.define('user:avatar');
      const config = RelationSlotConfig.fromRelationString(rel);

      expect(config.value).toBeDefined();
    });

    it('should throw if config not found', () => {
      expect(() => {
        RelationSlotConfig.fromRelationString(
          RelationString.define('unknown:slot' as any),
        );
      }).toThrow();
    });
  });
});
