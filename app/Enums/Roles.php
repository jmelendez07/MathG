<?php

namespace App\Enums;

enum Roles: string
{
    case ADMIN = 'administrador';
    case STUDENT = 'estudiante';
    case TEACHER = 'docente';
}
