<?php

namespace App\Enums;

enum TechnicianStatus: string
{
    case Online = 'online';
    case Offline = 'offline';
    case Busy = 'busy';
    case Emergency = 'emergency';
}
