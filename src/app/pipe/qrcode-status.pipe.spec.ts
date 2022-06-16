import { QrcodeStatusPipe } from './qrcode-status.pipe';

describe('QrcodeStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new QrcodeStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
