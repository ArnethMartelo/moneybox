import { Injectable } from '@angular/core';
import Swal from'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public alertMensaje(msj:string, type:any):void{
    Swal.fire({
      text: msj,
      icon: type,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#74298c',
      buttonsStyling:false,
      customClass:{
        confirmButton:' buttons btn btn-primary btn-space'
      }
    })
  }

  public alertConfirm (msj:string, icon:any): Promise<boolean>{
    return new Promise(resolve=>{
      Swal.fire({
        icon:icon,
        text:msj,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#74298c',
        cancelButtonColor: '#74298c',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        buttonsStyling:false,
        customClass:{
          confirmButton:' buttons btn btn-primary btn-space',
          cancelButton:' buttons btn btn-cancel',
        }
      }).then((result)=>{
       resolve(result.isConfirmed);
      })
    });
  }
}
