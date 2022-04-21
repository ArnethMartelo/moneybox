import { ADMITTED_DENOMINATION } from '@models/constants/home.constants';
import { Money } from '@models/money.interface';
import { AlertService } from '@services/alert.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public admittedDenomination: number[] = ADMITTED_DENOMINATION;
  public moneyboxForm: FormGroup;
  public coinCount: number = 0;
  public totalSaved: number = 0;
  public isBroken: boolean = false;
  public data: Money[] = [];
  private moneybox: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCoinCount();
    this.getTotalSaved();
  }

  private initForm(): void {
    this.moneyboxForm = this.formBuilder.group({
      quantity: ['', [Validators.required]],
      denomination: ['', [Validators.required]],
    });
  }

  public save(formValue: Money): void {
    if (this.isValidCoins(formValue)) {
      for (let i = 0; i < formValue.quantity; i++)
        this.moneybox.push(formValue.denomination);
      this.success(formValue);
    } else {
      this.alertService.alertMensaje(
        'Solo se admiten monedas de $50 $100 $200 $500 y $1000',
        'error'
      );
    }
  }

  private success(formValue: Money): void {
    this.alertService.alertConfirm(
      `Agregó ${formValue.quantity} moneda(s) de ${formValue.denomination} pesos a la alcancía!`,
      'success'
    );
    this.resetAll();
  }

  public resetAll(): void {
    this.moneyboxForm.reset();
    this.switchControls();
    this.getCoinCount();
    this.getTotalSaved();
  }

  private isValidCoins(money: Money): boolean {
    if (
      money.denomination === 50 ||
      money.denomination === 100 ||
      money.denomination === 200 ||
      money.denomination === 500 ||
      money.denomination === 1000
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getCoinCount(): void {
    this.coinCount = this.moneybox.length;
  }

  private getTotalSaved(): void {
    this.totalSaved = 0;
    this.moneybox.forEach((coin) => {
      this.totalSaved += coin;
    });
  }

  public restoreOrBreak(): void {
    !this.isBroken ? this.breakMoneybox() : this.restoreMoneybox();
  }

  private async breakMoneybox(): Promise<void> {
    const isConfirm = await this.alertService.alertConfirm(
      '¿Está seguro que desea romper la alcancía?',
      'warning'
    );
    if (isConfirm) {
      this.isBroken = true;
      this.resetAll();
      this.getData();
    }
  }

  public startMoneybox(): void {
    this.isBroken = false;
    this.moneybox = [];
    this.resetAll();
  }

  public restoreMoneybox(): void {
    this.isBroken = false;
    this.resetAll();
  }

  private getData(): void {
    this.data = [];
    this.admittedDenomination.forEach((denomination) => {
      const info = this.getCoinsByDenomination(denomination);
      this.data.push({ ...info });
    });
  }

  private switchControls(): void {
    if (!!this.isBroken) {
      this.moneyboxForm.controls['denomination'].disable();
      this.moneyboxForm.controls['quantity'].disable();
    } else {
      this.moneyboxForm.controls['denomination'].enable();
      this.moneyboxForm.controls['quantity'].enable();
    }
  }

  private getCoinsByDenomination(denomination: number) {
    const coinsByDenomination = this.moneybox.filter((d) => d == denomination);
    const data = {
      denomination: denomination,
      quantity: coinsByDenomination.length,
      totalAmount: denomination * coinsByDenomination.length,
    };
    return data;
  }

  public getErrorMessage(field: string): string {
    let message: string = '';
    if (this.moneyboxForm?.get(field)?.hasError('required')) {
      message = 'Campo requerido';
    } else if (this.moneyboxForm?.get(field)?.invalid) {
      message = 'Valor no valido';
    }
    return message;
  }

  public checkErrors(field: string): boolean | undefined {
    return (
      (this.moneyboxForm.get(field)?.touched ||
        this.moneyboxForm.get(field)?.dirty) &&
      this.moneyboxForm.get(field)?.invalid
    );
  }
}
