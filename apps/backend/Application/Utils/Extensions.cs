using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Application.Utils
{
    public static class Extensions
    {
        public static string EncodeToBase64(this string password)
        {
            byte[] bytes = Encoding.Unicode.GetBytes(password);
            byte[] inArray = HashAlgorithm.Create("SHA1").ComputeHash(bytes);
            return Convert.ToBase64String(inArray);
        }
    }
}
