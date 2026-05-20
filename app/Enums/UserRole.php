<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Technician = 'technician';
    case Admin = 'admin';

    public function dashboardPath(): string
    {
        return match ($this) {
            self::Admin => '/admin',
            self::Technician => '/technician',
            self::Customer => '/customer',
        };
    }
}
