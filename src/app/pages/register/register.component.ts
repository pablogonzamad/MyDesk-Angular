import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credential } from '../../../models/login.model';
import { Router, RouterLink } from '@angular/router';
import { Toast } from "bootstrap";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  private _apiAuth = inject(AuthService)
  private _router = inject(Router)

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required],
    })
  }


  async registro() {
    try {
      const credential: Credential = {
        email: this.registerForm.value.email || '',
        password: this.registerForm.value.pass || ''
      };
  
      const userCred = await this._apiAuth.crearUsuarioEmailNPass(credential);
  
      //Cerrar Sesión para Manejarlo en Login
      await this._apiAuth.logOut();  
  
      const uid = userCred?.user?.uid;
      if (uid) {
        await this._apiAuth.newUser(
          this.registerForm.value.name,
          this.registerForm.value.username,
          this.registerForm.value.email,
          uid
        );
      }
  
      console.log('Registro realizado con éxito'); 
      this.mostrarToast()
  
    } catch (error) {
      console.error('Error durante el registro: ', error);
    }
  }

  mostrarToast() {
    const toastEl = document.getElementById('liveToast');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 2000
      });
      toast.show();
    }
  }

}
