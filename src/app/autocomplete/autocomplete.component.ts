import {Component, computed, EventEmitter, Input, Output, SecurityContext, signal, WritableSignal} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Option} from "../data.models";
import {highlight} from "../substring-highlight.function";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {
  @Input()
  placeholder: string = ''

  @Input()
  set options(options: Option[]) {
    this.allOptions.set(options)
  }

  allOptions: WritableSignal<Option[]> = signal([])

  @Output()
  valueChange = new EventEmitter<Option['id']>()

  search: WritableSignal<string> = signal('')

  isInputFocused = false

  public filteredOptions = computed(() => {
    const search = this.search().toLowerCase()
    return this.allOptions().filter(
      (option) => option.name.toLowerCase().includes(search)
    )
  })

  constructor(private sanitizer: DomSanitizer) {
  }

  highlight(value: string, search: string | null): SafeHtml {
    if (!search) {
      return value
    }
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, value)
    if (!sanitized) {
      throw new Error('Sanitize failed')
    }
    const highlighted = highlight(sanitized, search)
    return this.sanitizer.bypassSecurityTrustHtml(highlighted)
  }

  onInputChange(value: string) {
    this.search.set(value)
  }

  optionSelected(option: Option) {
    this.valueChange.emit(option.id)
    this.search.set(option.name)
    this.isInputFocused = false
  }
}
