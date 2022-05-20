const isInteger = num => /^-?[0-9]+$/.test(num+'');

class Program {
  instructions = [];
  lines = []; // [{text, instruction}, ...]
  labelTable = {}; // 'label' => addr
  registerTable = []; // ['t1', 't2', ...]

  loadProgram = (assemblyCode, supportedInstructions) => {
    // breaks input code to array of text lines
    this.lines = assemblyCode
      .replace(/\r/g, '')
      .split('\n')
      .map(text => ({text}));

    // try to decode each line to see if it is a valid asm code
    let ip = 0; // instruction pointer
    for (const line of this.lines) {
      const text = line.text.trim();
      if (text.match(/^[^a-z]/)) continue; // line doesn't start with a-z
      if (text.endsWith(':')) { // label:
        const label = text.replace(':', '');
        this.labelTable[label] = ip-1;
      }
      const [opcode, value] = text.split(/\s+/);
      if (supportedInstructions[opcode]) {
        const instruction = {
          addr: ip,
          opcode,
          value: isInteger(value) ? parseInt(value) : value,
        }
        this.instructions.push(instruction);
        line.instruction = instruction;
        ip++;
      }
    }
    
    //console.log(this.instructions);
    //console.log(this.lines);
  }

  // WORK IN PROGRESS
  decodeRegisterOperation = (text) => {
    /* eslint-disable */
    text = text.replace(/\s+/, ''); // remove spaces
    const cjumpRegex = /cjump(t[a-z0-9]+)([<>=]+)(t[a-z0-9]+)[\-]+>(.*)/;
    const movRegex = /cjump(t[a-z0-9]+)([<>=]+)(t[a-z0-9]+)[\-]+>(.*)/;
    if (text.startsWith('cjump')) {
      const [_, reg1, op, reg2, label] = text.match(cjumpRegex);
      return {
        opcode: 'cjump',
        value: {reg1, op, reg2, label}
      }
    }
    /* eslint-enable */
  }

  setBreakpoint = (addr) => {
    const instruction = this.instructions[addr];
    if (instruction) {
      instruction.breakpoint = true;
    }
  }

  removeBreakpoint = (addr) => {
    const instruction = this.instructions[addr];
    if (instruction) {
      instruction.breakpoint = false;
    }
  }

  labelToInstructionAddress = (label) => {
    return this.labelTable[label];
  }

  getInstruction = (addr) => {
    return this.instructions[addr];
  }
}

export default Program;