import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { navIconsReport } from './report-nav';

@Component({
  selector: 'app-report',
  imports: [NgClass, RouterLink],
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  navIcons = navIconsReport;
}
