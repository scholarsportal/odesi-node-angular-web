import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicClassificationsComponent } from './topic-classifications.component';

describe('TopicClassificationsComponent', () => {
  let component: TopicClassificationsComponent;
  let fixture: ComponentFixture<TopicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicClassificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
