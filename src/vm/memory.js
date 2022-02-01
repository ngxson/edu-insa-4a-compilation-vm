export const DATA_TYPE_INT = 'int';
export const DATA_TYPE_MEM_ADDR = 'memory_addr';
export const DATA_TYPE_INSTR_ADDR = 'instruction_addr';
export const VALUE_DUMMY = 'dummy';

class Memory {
  data = [];

  setData = (address, value, type=DATA_TYPE_INT) => {
    // type is for debugging
    this.data[address] = { value, type };
  };

  getData = (address) => {
    const v = this.data[address];
    if (!v) {
      throw new Error('SEGFAULT: Access to non-exist memory location @' + address);
    } else {
      return v;
    }
  };

  erase = (address) => {
    if (address === this.data.length - 1)
      this.data.pop();
    else
      this.data[address] = undefined;
  };

  clone = () => {
    const m = new Memory();
    m.data = JSON.parse(JSON.stringify(this.data));
    return m;
  };
}

export default Memory;