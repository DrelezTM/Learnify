<?php

namespace App\Traits;

trait MakeEnrollmentKey {
    public function generateEnrollmentKey() {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $random = substr(str_shuffle($characters), 0, 10);

        return $random;
    }
}