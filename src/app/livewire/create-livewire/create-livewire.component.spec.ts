import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLivewireComponent } from './create-livewire.component';

describe('CreateLivewireComponent', () => {
  let component: CreateLivewireComponent;
  let fixture: ComponentFixture<CreateLivewireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLivewireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLivewireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
