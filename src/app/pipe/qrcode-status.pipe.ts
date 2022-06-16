import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "qrcodeStatus",
})
export class QrcodeStatusPipe implements PipeTransform {
  transform(value: string, args?: string): string {
    switch (value) {
      case "NOT_USED_YET":
        return "Chưa sử dụng";
      case "PRINTED":
        return "Đã in";
      case "IN_USED":
        return "Đã sử dụng";
      default:
        return value;
    }
  }
}
