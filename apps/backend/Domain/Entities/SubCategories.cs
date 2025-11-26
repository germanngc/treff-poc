using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class SubCategories
    {
        public int Id { get; set; }
        public int IdCategory { get; set; }
        public int IdSubCategory { get; set; }
        public Category Category { get; set; }
    }
}
