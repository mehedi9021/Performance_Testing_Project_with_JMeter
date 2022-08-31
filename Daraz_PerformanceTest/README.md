## Performance Testing on Rokomari Web Application Using JMeter

## Summary:
Test executed for the below mentioned scenario in server https://www.daraz.com.bd/.

- 1 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 1.34 And Total Concurrent API requested: 40.
- 5 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.98 And Total Concurrent API requested: 185.
- 10 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.51 And Total Concurrent API requested: 370.
- 15 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 1.94 And Total Concurrent API requested: 529.
- 20 Concurrent Request with 0 Loop Count; Avg TPS for Total Samples is ~ 2.22 And Total Concurrent API requested: 519.

While executed 185 concurrent request, found 14 request got connection timeout and error rate is 7.57%. 

Summary: Server can handle almost concurrent 40 API call with almost zero (0) percent error rate.

Please find the details report from the attachment and  let me know if you have any further queries.
