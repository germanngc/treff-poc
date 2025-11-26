using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Application.Utils
{
    public static class CodeGenerator
    {
        public static string GenerateSecurityCode()
        {
            //var buffer = new byte[sizeof(UInt64)];
            //var cryptoRng = new RSACryptoServiceProvider();
            //cryptoRng.(buffer);
            //var num = BitConverter.ToUInt64(buffer, 0);
            //var code = num % 1000000;
            //return code.ToString("D6");
            Random generator = new Random();
            return generator.Next(0, 1000000).ToString("D6");
        }
    }
}
