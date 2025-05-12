<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeItem extends Model
{
    protected $fillable = [
        'commande_id', 'part_name', 'quantity', 'rate', 'total'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
}
