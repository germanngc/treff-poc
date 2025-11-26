using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public partial class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Deleted { get; set; }
        public int? ParentId { get; set; }
        public string Image { get; set; }
        public string CoverImage { get; set; }
        public string VerticalImage { get; set; }
        public virtual List<Category> SubCategories { get; set; }
        public virtual Category Parent { get; set; }
        public virtual List<Service> Services { get; set; }
    }
}
