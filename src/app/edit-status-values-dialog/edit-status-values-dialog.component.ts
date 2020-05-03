import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-edit-status-values-dialog',
  templateUrl: './edit-status-values-dialog.component.html',
  styleUrls: ['./edit-status-values-dialog.component.scss']
})
export class EditStatusValuesDialogComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<EditStatusValuesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Map<string, number>) {
    this.form = fb.group({});
    this.data.forEach((value: number, key: string) => {
      this.form.addControl(key, new FormControl(value));
    });
  }

  ngOnInit(): void {
  }

  save() {
    const statusToPercentageMapper: Map<string, number> = new Map();
    Object.keys(this.form.controls).forEach(key => {
      statusToPercentageMapper.set(key, this.form.controls[key].value);
    });
    this.dialogRef.close(statusToPercentageMapper);
  }

  close() {
    this.dialogRef.close(this.data);
  }

  getArray(someMap): string[] {
    return Array.from(someMap);
  }
}
