import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageOurStoryComponent } from './page-our-story.component';

describe('PageOurStoryComponent', () => {
  let component: PageOurStoryComponent;
  let fixture: ComponentFixture<PageOurStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageOurStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageOurStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
