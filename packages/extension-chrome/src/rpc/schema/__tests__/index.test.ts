/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from '@ckb-lumos/lumos';
// import { bindSchemaValidator } from '..';
import { RpcMethods } from '../../types';

const bindSchemaValidator: any = jest.fn();

describe.skip('Rpc schema validator', () => {
  function getWrappedHandler(method: keyof RpcMethods) {
    return bindSchemaValidator(method, handler) as (...args: any[]) => any;
  }

  const handler = jest.fn();
  beforeEach(() => {
    handler.mockClear();
  });

  it('wallet_fullOwnership_signData', async () => {
    handler.mockReturnValue('signed message');
    const wrappedHandler = getWrappedHandler('wallet_fullOwnership_signData');

    await expect(wrappedHandler({ data: '0x1234' })).rejects.toThrowError(/Invalid params/);

    await expect(
      wrappedHandler({
        data: '0x1234',
        lock: { codeHash: '0x114514', hashType: 'data', args: '0x' },
      }),
    ).resolves.toBe('signed message');
  });

  it('wallet_fullOwnership_signTransaction', async () => {
    const tx = {
      cellDeps: [
        {
          outPoint: {
            txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
            index: '0x0',
          },
          depType: 'depGroup',
        },
        {
          outPoint: {
            txHash: '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c',
            index: '0x2',
          },
          depType: 'code',
        },
      ],
      inputs: [
        {
          previousOutput: {
            txHash: '0x9154df4f7336402114d04495175b37390ce86a4906d2d4001cf02c3e6d97f39c',
            index: '0x0',
          },
          since: '0x0',
        },
        {
          previousOutput: {
            txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
            index: '0x1',
          },
          since: '0x0',
        },
      ],
      outputs: [
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0x40af75b13d4a3845dd8b835abed0f51e18677240',
          },
          type: {
            codeHash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
            hashType: 'type',
            args: '0x',
          },
          capacity: '0xe72187e700',
        },
        {
          lock: {
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
            args: '0x69b1d6d0b6f40b007d01f19bb165a4c099840913',
          },
          capacity: '0x1718c73e6',
        },
      ],
      outputsData: ['0x3c484c0000000000', '0x'],
      headerDeps: ['0xaffb65e2f064eb039c624fc287d40bf60aae42cb7d3e6985cc102260f152deec'],
      hash: '0x1ea34c7b6735689a9661f1a43ece11a866e47718817d38e0c5b92e5a973df739',
      version: '0x0',
      witnesses: [
        '0x55000000100000005500000055000000410000007037d390c84ad7c9b44d62834e6f0e7f083ee5cedbc12b152392cc7fd00f56aa42ef412d61ba24e09fb19ea952b2996883a861bceffa7cba92df2bab224cc09d00',
        '0x55000000100000005500000055000000410000000e399817a6120495314b2c13738a84b5e5bdaef8be69b15af924c4ebbaf0373c40ae558f9370d94c72b19ecd697999ae8b73055876d850c3e05ea682664ce67a00',
      ],
    } as Transaction;
    handler.mockResolvedValue([]);
    const wrappedHandler = getWrappedHandler('wallet_fullOwnership_signTransaction');
    // wrappedHandler('wallet_fullOwnership_signTransaction', { tx });
    await expect(wrappedHandler({ tx })).resolves.toEqual([]);

    tx.inputs[0].since = 'Wrong since';
    await expect(wrappedHandler({ tx })).rejects.toThrow('Invalid params');
  });

  it('wallet_fullOwnership_getLiveCells', async () => {
    handler.mockReturnValue([]);
    const wrappedHandler = getWrappedHandler('wallet_fullOwnership_getLiveCells');
    await expect(wrappedHandler({})).resolves.toEqual([]);
    await expect(wrappedHandler({ cursor: 'To be continued...' })).resolves.toEqual([]);
    await expect(wrappedHandler({ cursor: 0 } as any)).rejects.toThrow('Invalid params');
  });

  it('wallet_fullOwnership_getOffChainLocks', async () => {
    handler.mockReturnValue('0x');
    const wrappedHandler = getWrappedHandler('wallet_fullOwnership_getOffChainLocks');
    await expect(wrappedHandler({})).resolves.toBe('0x');
    await expect(wrappedHandler({ change: 'external' })).resolves.toBe('0x');
    await expect(wrappedHandler({ change: 'Ape' as any })).rejects.toThrow('Invalid params');
  });

  it('wallet_fullOwnership_getOnChainLocks', async () => {
    handler.mockReturnValue('0x');
    const wrappedHandler = getWrappedHandler('wallet_fullOwnership_getOnChainLocks');

    await expect(wrappedHandler({})).resolves.toBe('0x');

    await expect(wrappedHandler({ change: 'external' })).resolves.toBe('0x');
    await expect(wrappedHandler({ change: 'Ape' as any })).rejects.toThrow('Invalid params');

    await expect(wrappedHandler({ cursor: 'To be continued...' })).resolves.toEqual('0x');
    await expect(wrappedHandler({ cursor: 0 } as any)).rejects.toThrow('Invalid params');
  });
});
