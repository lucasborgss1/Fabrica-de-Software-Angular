import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Ban,
  Calendar,
  MapPin,
  Users,
  Target,
  FileText,
} from 'lucide-angular';

import { StatusBadge } from '../../components/status-badge/status-badge';
import { Auth } from '../../core/services/auth';
import { projectRequests, workgroups, ProjectRequest, Workgroup } from '../../lib/mock-data';

@Component({
  selector: 'app-request-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, StatusBadge],
  templateUrl: './request-detail-page.html',
})
export class RequestDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  public auth = inject(Auth);

  // Ícones
  readonly ArrowLeft = ArrowLeft;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Ban = Ban;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Users = Users;
  readonly Target = Target;
  readonly FileText = FileText;

  // Estado
  project: ProjectRequest | undefined;
  group: Workgroup | undefined;

  ngOnInit() {
    // Busca o 'id' da URL (ex: /requests/p1)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.project = projectRequests.find((p) => p.id === id);
      this.group = workgroups.find((w) => w.projectId === id);
    }
  }

  goBack() {
    this.location.back();
  }
}
