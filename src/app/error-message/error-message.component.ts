import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {

  message = 'Wystąpił błąd, sprawdź czy: \n' +
    '1. Podany został prawidłowy format tokenu \n' +
    '2. Zostało wybrane postanowienie z listy \n' +
    '3. Jeśli obie powyższe rzeczy są poprawne prawdopodobnie wygasła ważność tokenu - \n' +
    '   odśwież stronę i podaj nowy token.';

  constructor(private dialogRef: MatDialogRef<ErrorMessageComponent>) {
  }

  ngOnInit() {
  }

}
