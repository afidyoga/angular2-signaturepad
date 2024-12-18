import { Component, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-surat-dummy',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent {
  @ViewChild('signaturePad') signaturePad: SignaturePad;
  signatureImg: string | null = null; // Untuk menyimpan tanda tangan sebagai base64

  // Opsi SignaturePad
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200
  };

  // Simpan tanda tangan dalam format base64
  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      alert("Tanda tangan kosong!");
      return;
    }
    this.signatureImg = this.signaturePad.toDataURL(); // Simpan dalam format base64
  }

  // Hapus tanda tangan
  clearSignature() {
    this.signaturePad.clear();
    this.signatureImg = null;
  }

  // Export tanda tangan (jika perlu)
  exportSignature() {
    console.log("Base64:", this.signatureImg);
  }
}
