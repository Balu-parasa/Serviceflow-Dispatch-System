<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Assigned = 'assigned';
    case Accepted = 'accepted';
    case EnRoute = 'en_route';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Assigned => 'Assigned',
            self::Accepted => 'Accepted',
            self::EnRoute => 'En Route',
            self::InProgress => 'In Progress',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function sortOrder(): int
    {
        return match ($this) {
            self::Pending => 0,
            self::Assigned => 1,
            self::Accepted => 2,
            self::EnRoute => 3,
            self::InProgress => 4,
            self::Completed => 5,
            self::Cancelled => 6,
        };
    }
}
