import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelecomDialogComponent } from './multi-selecom-dialog.component';

describe('MultiSelecomDialogComponent', () => {
  let component: MultiSelecomDialogComponent;
  let fixture: ComponentFixture<MultiSelecomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelecomDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelecomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
