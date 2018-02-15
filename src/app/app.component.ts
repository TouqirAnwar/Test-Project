// Import dependencies
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { FormBuilder, FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

// Import services
import { GithubService } from './service';

// Import interfaces
import { IItem, IUserResponse } from './interfaces/index';

@Component({
  selector: 'app-root',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
        ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public input: FormControl; // Form control for the input
  public users: IItem[] = []; // List of users

  constructor(
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private githubService: GithubService
  ) {
    this.initForm(); // Create the form control
  }

  /**
   * Creates the form control for the input.
   */
  private initForm(): void {
    this.input = new FormControl(''); // Create form control
    this.setWatch(); // Set watch for input change
  }

  /**
   * Sets a watch to the input by subscribing to value change.
   * Using the value make a call the service and get a response of users.
   */
  private setWatch(): void {
    // Check for input change
    this.input.valueChanges.debounceTime(250).subscribe((data: string) => {
      // Check if there is value present
      if (!data.trim()) {
        this.users = []; // Set user to empty array
        return; // Return
      }

      // Get users from GitHub API
      this.githubService.getUsers(data).subscribe(
        (response: IUserResponse) => {
          this.users = response.items.slice(0, 7); // Set users to repsonse
        },
        (error) => {
          this.users = []; // Set user to empty array
          console.log(error); // Log error
        }
      );
    });
  }

  /**
   * Goes to the users GitHub profile page.
   * @param url {string} User GitHub direct URL.
   */
  public goToUrl(url: string): void {
    window.location.href = url;
  }

  /**
   * Watch the action for the users url
   * @param event {any} Event action
   * @param url {string} User GitHub direct URL.
   */
  public keyDown(event: any, url?: string): void {
    // Check if users exist
    if (!this.users.length) {
      return;
    }

    const key: string = event.key; // Event key of keyboard key pressed
    const target: Element = event.target; // Element of the triggered event action
    let element: Element; // Element

    // Check which key was pressed
    switch (key) {
      case 'ArrowDown':
        // If target does not have a next element
        if (!target.nextElementSibling) {
          return;
        }
        element = target.nextElementSibling.querySelector('.user'); // Query for user
        // If no user, then get the next element
        if (!element) {
          element = target.nextElementSibling; // Set element
        }
        break;
      case 'ArrowUp':
        // Check if previous element exist or target is the input
        if (!target.previousElementSibling) {
          return;
        }
        element = target.previousElementSibling; // Set element
        break;
      case 'Enter':
        // Check if users GitHub URL is set, if set go to users GitHub page
        if (url) {
          this.goToUrl(url); // Go to the users GitHub profile page
        }
        break;
      default:
        break;
    }

    const elementRef: any = new ElementRef(element).nativeElement; // Convert to element
    // Check if elementRef exist to set focus
    if (elementRef) {
      elementRef.focus(); // Focus on the element
    }
  }
}
