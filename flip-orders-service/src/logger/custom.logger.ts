import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  constructor(@Inject(INQUIRER) private parentClass: object) {
    super();
    super.setContext(this.parentClass?.constructor?.name || 'Logger');
  }
}
