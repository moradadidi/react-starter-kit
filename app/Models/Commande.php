<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
    'client_id',
    'type_id',
    'date',
    'subtotal',
    'previous_balance',
    'total_due',
    'status',
];


    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(CommandeItem::class);
    }

 
    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    /**
     * Calculate the rest amount (total_amount - paid_amount).
     *
     * @return float
     */
    public function calculateRest()
    {
        return $this->total_amount - $this->paid_amount;
    }

    /**
     * Set the paid amount and update the rest amount.
     *
     * @param float $paidAmount
     */
    public function setPaidAmount(float $paidAmount)
    {
        $this->paid_amount = $paidAmount;
        $this->rest = $this->calculateRest();
        $this->save();
    }
}
